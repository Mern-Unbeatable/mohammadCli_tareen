import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { ChevronLeft, ImagePlus, X } from "lucide-react";
import { toast } from "react-toastify";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import {
  createListing,
  categoryToApi,
  MARKETPLACE_CATEGORY_OPTIONS,
  marketplaceApi,
} from "@/features/user/marketplace";
import { useAuth } from "@/shared/auth/useAuth";
import { conditions, years } from "@/modules/user/data/marketplace";
import { currentUser } from "@/modules/user/data/dashboard";

const fieldClass =
  "w-full rounded-lg border border-[#E4E7EC] bg-white px-3.5 py-2.5 text-[14px] text-deep-blue outline-none placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/10";

const labelClass = "mb-1.5 block text-[13px] font-semibold text-deep-blue";

const CONDITION_TO_API = {
  New: "NEW",
  "Like New": "LIKE_NEW",
  Good: "GOOD",
  Refurbished: "REFURBISHED",
  "For Parts": "FOR_PARTS",
};

const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/gif";
const IMAGE_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const MAX_PHOTOS = 12;
const MAX_FILE_MB = 10;
const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024;

const categoryOptions = MARKETPLACE_CATEGORY_OPTIONS.filter(
  (item) => item !== "All",
);

const makePhotoId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const CreateListingView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const photosRef = useRef([]);
  const { saving } = useSelector((state) => state.userMarketplace);
  const profileUser = useSelector((state) => state.userProfile.user);
  const { user: authUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [photos, setPhotos] = useState([]);

  photosRef.current = photos;

  const sourceUser = profileUser || authUser;
  const profile = sourceUser?.profile || {};
  const seller = {
    name:
      profile.name ||
      [profile.firstName, profile.lastName].filter(Boolean).join(" ") ||
      sourceUser?.email ||
      currentUser.name,
    company: profile.company || currentUser.company,
    location:
      profile.location || profile.country || currentUser.location || "",
  };

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: categoryOptions[0],
    condition: conditions[2],
    year: years[5],
    price: "",
  });

  const busy = saving || uploading;

  useEffect(() => {
    return () => {
      photosRef.current.forEach((photo) => {
        if (photo.previewUrl) URL.revokeObjectURL(photo.previewUrl);
      });
    };
  }, []);

  const update = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handlePickPhotos = (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length || busy) return;

    const remaining = MAX_PHOTOS - photos.length;
    if (remaining <= 0) {
      toast.error(`You can upload up to ${MAX_PHOTOS} photos`);
      return;
    }

    const next = [];
    for (const file of files.slice(0, remaining)) {
      if (!IMAGE_MIME.has(file.type)) {
        toast.error(`${file.name}: use JPG, PNG, WebP, or GIF`);
        continue;
      }
      if (file.size > MAX_FILE_BYTES) {
        toast.error(`${file.name}: max ${MAX_FILE_MB}MB per file`);
        continue;
      }
      next.push({
        id: makePhotoId(),
        file,
        previewUrl: URL.createObjectURL(file),
        name: file.name,
      });
    }

    if (files.length > remaining) {
      toast.info(`Only ${remaining} more photo(s) can be added`);
    }
    if (next.length) {
      setPhotos((prev) => [...prev, ...next]);
    }
  };

  const handleRemovePhoto = (id) => {
    setPhotos((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((p) => p.id !== id);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (busy) return;

    const title = form.title.trim();
    const description = form.description.trim();
    const category = categoryToApi(form.category);
    const condition = CONDITION_TO_API[form.condition];
    const year = Number(form.year);
    const price = Number(form.price);

    if (!title) {
      toast.error("Product name is required");
      return;
    }
    if (title.length > 200) {
      toast.error("Product name must be 200 characters or less");
      return;
    }
    if (!description) {
      toast.error("Description is required");
      return;
    }
    if (description.length > 5000) {
      toast.error("Description must be 5000 characters or less");
      return;
    }
    if (!category || !condition) {
      toast.error("Please select a valid category and condition");
      return;
    }
    if (!Number.isFinite(year) || year < 1980 || year > 2100) {
      toast.error("Please select a valid year");
      return;
    }
    if (!Number.isFinite(price) || price < 0) {
      toast.error("Please enter a valid price");
      return;
    }

    setUploading(true);
    try {
      let imageUrls = [];
      if (photos.length) {
        const uploaded = await marketplaceApi.uploadFiles(
          photos.map((p) => p.file),
        );
        imageUrls = uploaded.map((row) => row.url).filter(Boolean);
        if (imageUrls.length !== photos.length) {
          throw new Error("Some photos failed to upload");
        }
      }

      const payload = {
        title,
        description,
        category,
        condition,
        year,
        price,
        images: imageUrls,
        ...(seller.location ? { location: String(seller.location).trim() } : {}),
      };

      const result = await dispatch(createListing(payload));
      if (createListing.fulfilled.match(result)) {
        toast.success("Listing published");
        navigate("/marketplace/my-listings");
        return;
      }
      toast.error(result.payload || "Failed to create listing");
    } catch (err) {
      toast.error(
        marketplaceApi.getApiErrorMessage(err, "Failed to upload photos"),
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="pt-6 pb-5 sm:pt-8 sm:pb-8">
      <Container className="max-w-[760px]">
        <Link
          to="/marketplace"
          className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#64748B] transition-colors hover:text-primary"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to marketplace
        </Link>

        <Card>
          <div className="border-b border-[#E4E7EC] px-5 py-4 sm:px-6">
            <h1 className="text-[22px] font-bold text-deep-blue sm:text-[24px]">
              Create a listing
            </h1>
            <p className="mt-1 text-[14px] text-[#64748B]">
              Sell or exchange second-hand laboratory equipment.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 p-5 sm:p-6">
            <div>
              <label htmlFor="title" className={labelClass}>
                Product name
              </label>
              <input
                id="title"
                type="text"
                value={form.title}
                onChange={update("title")}
                placeholder="e.g. Agilent 1260 Infinity II HPLC System"
                className={fieldClass}
                maxLength={200}
                required
                disabled={busy}
              />
            </div>

            <div>
              <label htmlFor="description" className={labelClass}>
                Description
              </label>
              <textarea
                id="description"
                value={form.description}
                onChange={update("description")}
                rows={4}
                placeholder="Describe condition, accessories, validation status and delivery options..."
                className={`${fieldClass} resize-y`}
                maxLength={5000}
                required
                disabled={busy}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="category" className={labelClass}>
                  Category
                </label>
                <select
                  id="category"
                  value={form.category}
                  onChange={update("category")}
                  className={fieldClass}
                  disabled={busy}
                  required
                >
                  {categoryOptions.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="condition" className={labelClass}>
                  Condition
                </label>
                <select
                  id="condition"
                  value={form.condition}
                  onChange={update("condition")}
                  className={fieldClass}
                  disabled={busy}
                  required
                >
                  {conditions.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="year" className={labelClass}>
                  Year
                </label>
                <select
                  id="year"
                  value={form.year}
                  onChange={update("year")}
                  className={fieldClass}
                  disabled={busy}
                  required
                >
                  {years.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="price" className={labelClass}>
                  Price (€)
                </label>
                <input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={update("price")}
                  placeholder="1850"
                  className={fieldClass}
                  required
                  disabled={busy}
                />
              </div>
            </div>

            <div>
              <p className={labelClass}>
                Photos{" "}
                <span className="font-normal text-[#98A2B3]">
                  (optional · up to {MAX_PHOTOS} · JPG, PNG, WebP, GIF)
                </span>
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept={IMAGE_ACCEPT}
                multiple
                className="hidden"
                onChange={handlePickPhotos}
                disabled={busy}
              />

              {photos.length ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {photos.map((photo) => (
                    <div
                      key={photo.id}
                      className="relative aspect-[4/3] overflow-hidden rounded-lg border border-[#E4E7EC] bg-[#F9FAFB]"
                    >
                      <img
                        src={photo.previewUrl}
                        alt={photo.name}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(photo.id)}
                        disabled={busy}
                        aria-label={`Remove ${photo.name}`}
                        className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-[#475467] shadow-sm hover:text-[#CC1016] disabled:opacity-50"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                  {photos.length < MAX_PHOTOS ? (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={busy}
                      className="flex aspect-[4/3] flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-[#D0D5DD] bg-[#F9FAFB] text-[#64748B] transition-colors hover:border-primary hover:bg-secondary/40 disabled:opacity-50"
                    >
                      <ImagePlus className="h-5 w-5 text-[#98A2B3]" />
                      <span className="text-[12px] font-medium">Add more</span>
                    </button>
                  ) : null}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={busy}
                  className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[#D0D5DD] bg-[#F9FAFB] px-4 py-10 text-[#64748B] transition-colors hover:border-primary hover:bg-secondary/40 disabled:opacity-50"
                >
                  <ImagePlus className="h-6 w-6 text-[#98A2B3]" />
                  <span className="text-[13px] font-medium">
                    Add product photos
                  </span>
                </button>
              )}
            </div>

            <div className="rounded-lg border border-[#E4E7EC] bg-[#F9FAFB] px-4 py-3 text-[13px] text-[#64748B]">
              <span className="font-semibold text-deep-blue">
                Seller information:
              </span>{" "}
              {seller.name} · {seller.company} · {seller.location || "—"}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={busy}
                className="rounded-md bg-primary px-4 py-2 text-[12px] font-semibold text-white hover:bg-[#066BB0] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {uploading
                  ? "Uploading photos…"
                  : saving
                    ? "Publishing…"
                    : "Publish listing"}
              </button>
            </div>
          </form>
        </Card>
      </Container>
    </main>
  );
};

export default CreateListingView;

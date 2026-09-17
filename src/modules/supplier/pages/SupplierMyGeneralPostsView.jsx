import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Pagination from "@/components/common/Pagination/Pagination";
import ConfirmModal from "@/components/common/ConfirmModal/ConfirmModal";
import { CardSkeleton } from "@/components/common/Skeleton";
import GeneralPostCard from "@/components/data-display/GeneralPostCard/GeneralPostCard";
import GeneralToolbar from "@/modules/user/components/general/GeneralToolbar";
import CreateGeneralPostModal from "@/shared/pages/general/CreateGeneralPostModal";
import PanelPage from "@/shared/layout/PanelLayout/PanelPage";
import {
  fetchSupplierGeneralPosts,
  createSupplierGeneralPost,
  removeSupplierGeneralPost,
  clearGeneralError,
  invalidateGeneralPostsList,
  categoryToApi,
  toGeneralPostModel,
  formToCreatePayload,
} from "@/features/supplier/general";
import { GRID_PAGE_SIZE } from "@/shared/hooks/usePaginatedList";

const BASE = "/supplier/general";

const buildMyPostsQuery = ({ page, category }) => {
  const params = {
    page,
    pageSize: GRID_PAGE_SIZE,
    sort: "desc",
    mine: true,
  };
  const type = categoryToApi(category);
  if (type) params.type = type;
  return params;
};

const SupplierMyGeneralPostsView = () => {
  const dispatch = useDispatch();
  const { posts, postsMeta, postsLoading, saving, deleting, error } =
    useSelector((state) => state.supplierGeneral);

  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);

  useLayoutEffect(() => {
    dispatch(clearGeneralError());
    dispatch(
      fetchSupplierGeneralPosts(buildMyPostsQuery({ page, category })),
    );
  }, [dispatch, page, category]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const pageItems = useMemo(
    () => (posts || []).map(toGeneralPostModel).filter(Boolean),
    [posts],
  );

  const totalPages = Math.max(1, postsMeta?.totalPages || 1);

  const handleCategoryChange = (next) => {
    if (next === category) return;
    dispatch(invalidateGeneralPostsList());
    setCategory(next);
    setPage(1);
  };

  const handlePageChange = (next) => {
    if (next === page) return;
    dispatch(invalidateGeneralPostsList());
    setPage(next);
  };

  const handleDeleteRequest = (postId) => {
    if (deleting) return;
    const post = pageItems.find((item) => item.id === postId);
    if (!post) return;
    setPendingDelete(post);
  };

  const handleCloseDeleteModal = () => {
    if (deleting) return;
    setPendingDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete?.id || deleting) return;

    const result = await dispatch(
      removeSupplierGeneralPost(pendingDelete.id),
    );
    if (removeSupplierGeneralPost.fulfilled.match(result)) {
      toast.success("Post deleted");
      setPendingDelete(null);
      return;
    }
    toast.error(result.payload || "Failed to delete post");
  };

  const handleCreate = async (form) => {
    const payload = formToCreatePayload(form);
    if (!payload.title) {
      toast.error("Title is required");
      return false;
    }
    if (payload.type === "DOCUMENT" && !payload.documentUrl) {
      toast.error("Document URL is required");
      return false;
    }

    const result = await dispatch(createSupplierGeneralPost(payload));
    if (createSupplierGeneralPost.fulfilled.match(result)) {
      toast.success("Post published");
      dispatch(invalidateGeneralPostsList());
      dispatch(
        fetchSupplierGeneralPosts(buildMyPostsQuery({ page: 1, category })),
      );
      setPage(1);
      return true;
    }
    toast.error(result.payload || "Failed to create post");
    return false;
  };

  return (
    <PanelPage>
      <GeneralToolbar
        category={category}
        onCategoryChange={handleCategoryChange}
        activeView="mine"
        onCreatePost={() => setModalOpen(true)}
        myPostHref={`${BASE}/my-posts`}
      />

      {postsLoading ? (
        <CardSkeleton
          variant="generalPost"
          count={GRID_PAGE_SIZE}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        />
      ) : pageItems.length ? (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {pageItems.map((post) => (
              <GeneralPostCard
                key={post.id}
                post={post}
                variant="mine"
                detailHref={`${BASE}/${post.id}`}
                onDelete={deleting ? undefined : handleDeleteRequest}
              />
            ))}
          </div>
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            className="mt-8"
          />
        </>
      ) : (
        <div className="rounded-xl border border-[#E4E7EC] bg-white px-6 py-14 text-center">
          <p className="text-[15px] font-semibold text-deep-blue sm:text-[16px]">
            No posts yet
          </p>
          <p className="mt-2 text-[14px] text-[#64748B] sm:text-[15px]">
            Share industry news or documentation with the laboratory community.
          </p>
        </div>
      )}

      <CreateGeneralPostModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
        saving={saving}
      />

      <ConfirmModal
        open={Boolean(pendingDelete)}
        title="Delete post?"
        description={
          pendingDelete ? (
            <p className="text-[14px] leading-relaxed text-[#64748B]">
              This will permanently remove{" "}
              <span className="font-semibold text-deep-blue">
                {pendingDelete.title || "this post"}
              </span>
              . This action cannot be undone.
            </p>
          ) : null
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirming={deleting}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </PanelPage>
  );
};

export default SupplierMyGeneralPostsView;

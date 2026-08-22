const FooterLayout = () => {
  const currentYear = new Date().getFullYear();
  return (
    <div className="bg-[#F7F8FA]">
      <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-6 py-5 sm:flex-row lg:px-8 lg:py-6">
        <p className="text-[13px] text-[#475467] lg:text-[14px]">
          © {currentYear} Lab Unity. All Rights Reserved.
        </p>
        <button
          type="button"
          className="text-[13px] text-[#475467] transition-colors hover:text-deep-blue lg:text-[14px]"
        >
          English
        </button>
      </div>
    </div>
  );
};

export default FooterLayout;

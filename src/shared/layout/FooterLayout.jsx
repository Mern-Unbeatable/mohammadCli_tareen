import Container from '@/components/ui/Container';

const FooterLayout = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="mt-auto w-full border-t border-[#E4E7EC] bg-[#F7F8FA]">
      <Container className="flex flex-col items-center justify-between gap-3 py-5 sm:flex-row lg:py-6">
        <p className="text-[13px] text-[#475467] lg:text-[14px]">
          © {currentYear} Lab Unity. All Rights Reserved.
        </p>
        <button
          type="button"
          className="text-[13px] text-[#475467] transition-colors hover:text-deep-blue lg:text-[14px]"
        >
          English
        </button>
      </Container>
    </footer>
  );
};

export default FooterLayout;

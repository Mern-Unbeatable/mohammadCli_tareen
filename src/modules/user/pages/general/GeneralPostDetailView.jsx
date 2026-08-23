import Container from '@/components/ui/Container';
import GeneralPostDetailPageContent from '@/shared/pages/general/GeneralPostDetailPageContent';

const GeneralPostDetailView = () => (
  <main className="pt-6 pb-8 sm:pt-8">
    <Container className="max-w-[760px]">
      <GeneralPostDetailPageContent backPath="/general" />
    </Container>
  </main>
);

export default GeneralPostDetailView;

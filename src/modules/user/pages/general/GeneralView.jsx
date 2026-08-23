import Container from '@/components/ui/Container';
import GeneralPageContent from '@/shared/pages/general/GeneralPageContent';

const GeneralView = () => (
  <main className="pt-6 pb-8 sm:pt-8">
    <Container>
      <GeneralPageContent basePath="/general" activeView="browse" />
    </Container>
  </main>
);

export default GeneralView;

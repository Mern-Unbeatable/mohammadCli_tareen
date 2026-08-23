import Container from '@/components/ui/Container';
import GeneralPageContent from '@/shared/pages/general/GeneralPageContent';

const MyGeneralPostsView = () => (
  <main className="pt-6 pb-8 sm:pt-8">
    <Container>
      <GeneralPageContent basePath="/general" activeView="mine" />
    </Container>
  </main>
);

export default MyGeneralPostsView;

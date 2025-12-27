import Header from '@/components/layout/Header';
import Hero from '@/components/home/Hero';
import { Helmet } from 'react-helmet-async';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>VoyageAI - Planificateur de voyage intelligent</title>
        <meta name="description" content="Créez votre itinéraire de voyage personnalisé avec notre assistant IA. Destinations sur mesure, planning optimisé et recommandations locales." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <Hero />
      </div>
    </>
  );
};

export default Index;

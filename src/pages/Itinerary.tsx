import Header from '@/components/layout/Header';
import ItineraryView from '@/components/itinerary/ItineraryView';
import { Helmet } from 'react-helmet-async';

const Itinerary = () => {
  return (
    <>
      <Helmet>
        <title>Mon itinéraire - VoyageAI</title>
        <meta name="description" content="Consultez votre itinéraire de voyage personnalisé avec toutes les activités, restaurants et recommandations." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-12">
          <div className="container mx-auto px-4">
            <ItineraryView />
          </div>
        </main>
      </div>
    </>
  );
};

export default Itinerary;

import Header from '@/components/layout/Header';
import PreferencesForm from '@/components/preferences/PreferencesForm';
import { Helmet } from 'react-helmet-async';

const Preferences = () => {
  return (
    <>
      <Helmet>
        <title>Planifier mon voyage - VoyageAI</title>
        <meta name="description" content="Définissez vos préférences de voyage et laissez notre IA créer l'itinéraire parfait pour vous." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-10">
                <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
                  Planifiez votre voyage
                </h1>
                <p className="text-muted-foreground">
                  Parlez-nous de vos envies et notre IA créera l'itinéraire parfait
                </p>
              </div>
              
              <div className="bg-card rounded-2xl shadow-card p-6 md:p-8">
                <PreferencesForm />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Preferences;

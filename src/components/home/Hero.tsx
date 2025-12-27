import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, MapPin, Calendar, MessageCircle } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-ocean/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-coral/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-ocean/5 to-transparent rounded-full" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          

          {/* Main heading */}
          <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Votre voyage parfait,{' '}
            <span className="text-gradient">créé sur mesure</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Décrivez vos envies, et notre assistant IA génère un itinéraire personnalisé 
            avec activités, hébergements et recommandations locales.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <Button size="xl" asChild>
              <Link to="/preferences">
                <Sparkles className="w-5 h-5 mr-2" />
                Planifier mon voyage
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link to="/chat">
                <MessageCircle className="w-5 h-5 mr-2" />
                Parler à l'assistant
              </Link>
            </Button>
          </div>

          {/* Feature cards */}
          <div className="grid md:grid-cols-3 gap-6 animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <FeatureCard
              icon={<MapPin className="w-6 h-6" />}
              title="Destinations sur mesure"
              description="Des itinéraires adaptés à vos goûts et centres d'intérêt"
            />
            <FeatureCard
              icon={<Calendar className="w-6 h-6" />}
              title="Planning optimisé"
              description="Chaque journée organisée pour profiter au maximum"
            />
            <FeatureCard
              icon={<MessageCircle className="w-6 h-6" />}
              title="Assistant personnel"
              description="Ajustez votre voyage en conversant avec notre IA"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="p-6 rounded-2xl bg-card shadow-card hover:shadow-elevated transition-all duration-300 group">
    <div className="w-12 h-12 rounded-xl bg-ocean/10 text-ocean flex items-center justify-center mb-4 group-hover:bg-ocean group-hover:text-primary-foreground transition-colors">
      {icon}
    </div>
    <h3 className="font-display text-lg font-semibold text-foreground mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

export default Hero;

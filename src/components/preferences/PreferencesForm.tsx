import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useTravel } from '@/context/TravelContext';
import { TravelPreferences } from '@/types/travel';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon, MapPin, Users, Sparkles, Loader2 } from 'lucide-react';
import { generateItineraryWithLLM } from '@/services/itineraryLLMService';

const interests = [
  { id: 'culture', label: 'Culture & Histoire', emoji: '🏛️' },
  { id: 'nature', label: 'Nature & Randonnée', emoji: '🌲' },
  { id: 'gastronomy', label: 'Gastronomie', emoji: '🍽️' },
  { id: 'adventure', label: 'Aventure', emoji: '🎯' },
  { id: 'relaxation', label: 'Détente', emoji: '🧘' },
  { id: 'nightlife', label: 'Vie nocturne', emoji: '🌙' },
  { id: 'shopping', label: 'Shopping', emoji: '🛍️' },
  { id: 'art', label: 'Art & Musées', emoji: '🎨' },
];

const travelStyles = [
  { id: 'budget', label: 'Économique', description: 'Maximiser les expériences, minimiser les coûts' },
  { id: 'comfort', label: 'Confort', description: 'Bon équilibre qualité-prix' },
  { id: 'luxury', label: 'Luxe', description: 'Les meilleures expériences sans compromis' },
];

const PreferencesForm = () => {
  const navigate = useNavigate();
  const { setPreferences, setItinerary, setIsLoading, isLoading } = useTravel();

  const [formData, setFormData] = useState<TravelPreferences>({
    destination: '',
    startDate: undefined,
    endDate: undefined,
    budget: 1500,
    interests: [],
    travelStyle: 'comfort',
    travelers: 2,
  });

  const toggleInterest = (id: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(id)
        ? prev.interests.filter(i => i !== id)
        : [...prev.interests, id]
    }));
  };

 
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setPreferences(formData);
  setIsLoading(true);

  try {
    const days =
      Math.ceil(
        (formData.endDate!.getTime() - formData.startDate!.getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1;

    const payload = {
      destination: formData.destination,
      days,
      budget: formData.budget,
      interests: formData.interests,
      travelStyle: formData.travelStyle,
      travelers: formData.travelers,
      startDate: formData.startDate,
      endDate: formData.endDate,
    };

    console.log("📤 Payload envoyé au backend (LLM):", payload);

    const itinerary = await generateItineraryWithLLM(payload);

    setItinerary(itinerary);
    navigate("/itinerary");
  } catch (error) {
    console.error("❌ Error generating itinerary:", error);
  } finally {
    setIsLoading(false);
  }
};



  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Destination */}
      <div className="space-y-3">
        <Label htmlFor="destination" className="text-base font-medium flex items-center gap-2">
          <MapPin className="w-4 h-4 text-ocean" />
          Destination
        </Label>
        <Input
          id="destination"
          placeholder="Paris, Tokyo, New York..."
          value={formData.destination}
          onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
          className="h-12 text-base"
          required
        />
      </div>

      {/* Dates */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Date de départ */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-ocean" />
            Date de départ
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full h-12 justify-start text-left font-normal",
                  !formData.startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.startDate ? format(formData.startDate, "PPP", { locale: fr }) : "Sélectionner"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.startDate}
                onSelect={(date) => setFormData(prev => ({ ...prev, startDate: date }))}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Date de retour */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Date de retour</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full h-12 justify-start text-left font-normal",
                  !formData.endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.endDate ? format(formData.endDate, "PPP", { locale: fr }) : "Sélectionner"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.endDate}
                onSelect={(date) => setFormData(prev => ({ ...prev, endDate: date }))}
                disabled={(date) => date < (formData.startDate || new Date())}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Nombre de voyageurs */}
      <div className="space-y-3">
        <Label className="text-base font-medium flex items-center gap-2">
          <Users className="w-4 h-4 text-ocean" />
          Nombre de voyageurs
        </Label>
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setFormData(prev => ({ ...prev, travelers: Math.max(1, prev.travelers - 1) }))}
          >
            -
          </Button>
          <span className="text-2xl font-semibold w-12 text-center">{formData.travelers}</span>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setFormData(prev => ({ ...prev, travelers: Math.min(10, prev.travelers + 1) }))}
          >
            +
          </Button>
        </div>
      </div>

      {/* Budget */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium">Budget total</Label>
          <span className="text-2xl font-bold text-ocean">{formData.budget.toLocaleString('fr-FR')} €</span>
        </div>
        <Slider
          value={[formData.budget]}
          onValueChange={([value]) => setFormData(prev => ({ ...prev, budget: value }))}
          min={200}
          max={10000}
          step={100}
          className="py-4"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>200 €</span>
          <span>10 000 €</span>
        </div>
      </div>

      {/* Centres d'intérêt */}
      <div className="space-y-4">
        <Label className="text-base font-medium">Centres d'intérêt</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {interests.map((interest) => (
            <button
              key={interest.id}
              type="button"
              onClick={() => toggleInterest(interest.id)}
              className={cn(
                "p-4 rounded-xl border-2 transition-all duration-200 text-left",
                formData.interests.includes(interest.id)
                  ? "border-ocean bg-ocean/10 shadow-soft"
                  : "border-border hover:border-ocean/50 hover:bg-muted"
              )}
            >
              <span className="text-2xl mb-2 block">{interest.emoji}</span>
              <span className="text-sm font-medium">{interest.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Style de voyage */}
      <div className="space-y-4">
        <Label className="text-base font-medium">Style de voyage</Label>
        <div className="grid md:grid-cols-3 gap-4">
          {travelStyles.map((style) => (
            <button
              key={style.id}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, travelStyle: style.id }))}
              className={cn(
                "p-5 rounded-xl border-2 transition-all duration-200 text-left",
                formData.travelStyle === style.id
                  ? "border-ocean bg-ocean/10 shadow-soft"
                  : "border-border hover:border-ocean/50 hover:bg-muted"
              )}
            >
              <span className="font-semibold block mb-1">{style.label}</span>
              <span className="text-sm text-muted-foreground">{style.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        variant="hero"
        size="xl"
        className="w-full"
        disabled={isLoading || !formData.destination || !formData.startDate || !formData.endDate}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Création de votre itinéraire...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 mr-2" />
            Générer mon itinéraire
          </>
        )}
      </Button>
    </form>
  );
};

export default PreferencesForm;

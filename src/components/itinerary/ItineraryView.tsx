import React from "react";
import { Link } from "react-router-dom";
import { useTravel } from "@/context/TravelContext";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Calendar,
  Euro,
  Clock,
  Lightbulb,
  MessageCircle,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* =========================
   Component principal
========================= */
const ItineraryView = () => {
  const { itinerary } = useTravel();

  if (!itinerary) {
    return (
      <div className="text-center py-24">
        <h2 className="font-display text-2xl font-semibold mb-4">
          Aucun itinéraire
        </h2>
        <p className="text-muted-foreground mb-8">
          Commencez par définir vos préférences de voyage
        </p>
        <Button asChild>
          <Link to="/preferences">Créer mon voyage</Link>
        </Button>
      </div>
    );
  }

  const totalActivities = itinerary.days.reduce(
    (acc, day) => acc + day.activities.length,
    0
  );

  return (
    <div className="space-y-10">
      {/* =========================
          HERO HEADER
      ========================= */}
      <div className="relative rounded-3xl bg-gradient-ocean p-6 md:p-8 text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/noise.png')]" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <Link
              to="/preferences"
              className="inline-flex items-center gap-2 text-sm opacity-80 hover:opacity-100 mb-3"
            >
              <ArrowLeft className="w-4 h-4" />
              Modifier mes préférences
            </Link>

            <h1 className="font-display text-3xl md:text-4xl font-bold flex items-center gap-3">
              <MapPin className="w-8 h-8" />
              Votre voyage à {itinerary.destination}
            </h1>

            <div className="flex flex-wrap gap-3 mt-4 text-sm">
              <span className="px-3 py-1 rounded-full bg-white/10">
                {itinerary.days.length} jours
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10">
                {(itinerary.Budget ?? 0).toLocaleString("fr-FR")} DH
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10">
                {totalActivities} activités
              </span>
            </div>
          </div>

          <Button variant="coral" size="lg" asChild>
            <Link to="/chat">
              <MessageCircle className="w-4 h-4 mr-2" />
              Ajuster avec l’assistant
            </Link>
          </Button>
        </div>
      </div>

      {/* =========================
          SUMMARY CARDS
      ========================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard
          icon={<MapPin className="w-5 h-5" />}
          label="Destination"
          value={itinerary.destination}
        />
        <SummaryCard
          icon={<Calendar className="w-5 h-5" />}
          label="Durée"
          value={`${itinerary.days.length} jours`}
        />
        <SummaryCard
          icon={<Euro className="w-5 h-5" />}
          label="Budget"
          value={`${(itinerary.Budget ?? 0).toLocaleString("fr-FR")} DH`}
        />
        <SummaryCard
          icon={<Clock className="w-5 h-5" />}
          label="Activités"
          value={`${totalActivities} prévues`}
        />
      </div>

      {/* =========================
          TIPS
      ========================= */}
      {itinerary.tips?.length > 0 && (
        <div className="bg-ocean/5 border border-ocean/20 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-ocean" />
            <h3 className="font-semibold">Conseils pour votre voyage</h3>
          </div>

          <ul className="grid md:grid-cols-2 gap-3">
            {itinerary.tips.map((tip, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-ocean mt-2 shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* =========================
          PROGRAMME JOUR PAR JOUR
      ========================= */}
      <div className="space-y-6">
        <h2 className="font-display text-2xl font-semibold">
          Programme jour par jour
        </h2>

        {itinerary.days.map((day, dayIndex) => (
          <div
            key={day.day}
            className="bg-card rounded-3xl shadow-card overflow-hidden animate-fade-up"
            style={{ animationDelay: `${dayIndex * 0.1}s` }}
          >
            {/* Header du jour */}
            <div className="relative bg-gradient-ocean px-6 py-5 text-primary-foreground">
              <span className="absolute top-4 right-4 text-xs px-3 py-1 rounded-full bg-white/10">
                Jour {day.day}
              </span>

              <h3 className="font-display text-xl font-semibold">
                {day.title}
              </h3>

              {day.date && (
                <p className="text-sm opacity-80 mt-1">{day.date}</p>
              )}
            </div>

            {/* Activités */}
            <div className="p-6">
              <div className="relative space-y-6">
                <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />

                {day.activities.map((activity: any, index: number) => {
                  const act =
                    typeof activity === "string"
                      ? { title: activity }
                      : activity;

                  return (
                    <div key={act.id ?? index} className="relative pl-12">
                      {/* Icone unique */}
                      <div
                        className={cn(
                          "absolute left-0 top-2 w-10 h-10 rounded-full flex items-center justify-center bg-ocean/10 text-ocean"
                        )}
                      >
                        <MapPin className="w-4 h-4" />
                      </div>

                      <div className="bg-muted/40 rounded-xl p-4 hover:bg-muted/60 transition">
                        <div className="flex justify-between gap-4">
                          <div>
                            {act.time && (
                              <span className="text-xs text-muted-foreground">
                                {act.time}
                              </span>
                            )}

                            <h4 className="font-medium">{act.title}</h4>

                            {act.description && (
                              <p className="text-sm text-muted-foreground">
                                {act.description}
                              </p>
                            )}

                            {act.location && (
                              <p className="text-xs text-muted-foreground mt-1">
                                📍 {act.location}
                              </p>
                            )}
                          </div>

                          {act.estimatedCost && (
                            <span className="text-xs px-2 py-1 rounded-full bg-coral/10 text-coral h-fit">
                              {act.estimatedCost} DH
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* =========================
   SummaryCard
========================= */
const SummaryCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="bg-card rounded-2xl p-4 shadow-soft hover:shadow-lg hover:-translate-y-1 transition-all">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-ocean/10 text-ocean flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </div>
  </div>
);

export default ItineraryView;

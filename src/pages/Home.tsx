import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MoodSlider } from "@/components/MoodSlider";
import { PublicStats } from "@/components/PublicStats";
import {
  Brain,
  Shield,
  Clock,
  BookOpen,
  Activity,
  Star,
  Sparkles,
  Users,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const benefits = [
  {
    icon: Clock,
    title: "Soporte 24/7",
    description:
      "Tu compañero IA siempre disponible para escucharte y ofrecerte apoyo cuando lo necesites.",
  },
  {
    icon: Brain,
    title: "Insights Inteligentes",
    description:
      "Análisis avanzado de patrones emocionales para ayudarte a entender mejor tu bienestar mental.",
  },
  {
    icon: Shield,
    title: "Privado y Seguro",
    description:
      "Tus datos están protegidos con encriptación de nivel empresarial. Tu privacidad es nuestra prioridad.",
  },
  {
    icon: BookOpen,
    title: "Basado en Evidencia",
    description:
      "Recomendaciones fundamentadas en técnicas terapéuticas probadas y ciencia del comportamiento.",
  },
];

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleMoodSelect = () => {
    if (!user) {
      navigate("/signup");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-gradient">ArmonIA</span>
          </div>
          <nav className="flex items-center space-x-4">
            {user ? (
              <Link to="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Iniciar Sesión</Button>
                </Link>
                <Link to="/signup">
                  <Button className="btn-hero">Comenzar</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center max-w-6xl">
          <div className="animate-fade-in-up mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="text-gradient">ArmonIA:</span>
              <br />
              Tu Compañero IA de <br />
              <span className="text-primary">Salud Mental</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Experimenta soporte emocional con IA que escucha, entiende y te
              guía hacia un mayor bienestar mental. Tu espacio seguro para el
              crecimiento personal.
            </p>
          </div>

          {/* Mood Selector Demo */}
          <div
            className="animate-fade-in-up mb-12"
            style={{ animationDelay: "0.2s" }}
          >
            <Card className="shadow-soft hover-lift mb-8 max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl">Encuentra Paz Mental</CardTitle>
                <CardDescription>
                  ¿Cómo te sientes hoy? Selecciona tu estado de ánimo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MoodSlider onMoodSelect={handleMoodSelect} />
                <p className="text-sm text-muted-foreground mt-4">
                  {user
                    ? "Haz clic en cualquier estado para ir a tu dashboard"
                    : "Registrarte para guardar tu progreso"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* CTA Buttons */}
          <div
            className="animate-fade-in-up flex flex-col sm:flex-row gap-4 justify-center items-center"
            style={{ animationDelay: "0.4s" }}
          >
            {!user && (
              <>
                <Link to="/signup">
                  <Button size="lg" className="btn-hero px-8 py-4 text-lg">
                    Comenzar Gratis
                  </Button>
                </Link>
                <Link to="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-8 py-4 text-lg"
                  >
                    Ya tengo cuenta
                  </Button>
                </Link>
              </>
            )}
            {user && (
              <Link to="/dashboard">
                <Button size="lg" className="btn-hero px-8 py-4 text-lg">
                  Ir al Dashboard
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿Por qué elegir <span className="text-primary">ArmonIA</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Una plataforma integral diseñada para apoyar tu bienestar
              emocional con tecnología de vanguardia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {benefits.map((benefit, index) => (
              <Card
                key={benefit.title}
                className="hover-lift shadow-soft animate-fade-in-up h-full"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                    <benefit.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-semibold">
                    {benefit.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-center text-base leading-relaxed">
                    {benefit.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Public Stats Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <PublicStats />
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl text-center">
          <Card className="shadow-mood border-primary/20 bg-gradient-to-br from-background to-primary/5">
            <CardContent className="p-8 md:p-12">
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-6 w-6 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <blockquote className="text-xl md:text-2xl lg:text-3xl font-medium text-muted-foreground mb-8 leading-relaxed">
                "ArmonIA me ha ayudado a entender mejor mis patrones emocionales
                y a desarrollar técnicas efectivas para manejar el estrés. Es
                como tener un terapeuta disponible 24/7."
              </blockquote>
              <cite className="text-primary font-semibold text-lg">
                — María González, Usuaria Beta
              </cite>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50 py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Activity className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">ArmonIA</span>
          </div>
          <p className="text-muted-foreground mb-4">
            Bootcamp FullStack La Fábrica - Jeniffer Huera, David Guanoluisa &
            Jeyson Mueses
          </p>
          <p>From 🇪🇨 With 💙 to the 🌍 </p>
        </div>
      </footer>
    </div>
  );
};

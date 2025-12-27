import Header from '@/components/layout/Header';
import ChatInterface from '@/components/chat/ChatInterface';
import { Helmet } from 'react-helmet-async';

const Chat = () => {
  return (
    <>
      <Helmet>
        <title>Assistant voyage - VoyageAI</title>
        <meta name="description" content="Discutez avec notre assistant IA pour personnaliser et améliorer votre itinéraire de voyage." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <ChatInterface />
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Chat;

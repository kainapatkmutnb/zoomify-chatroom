// Update this page (the content is just a fallback if you fail to update the page)

import VideoChat from '../components/VideoChat';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to Your Video Chat App</h1>
        <p className="text-xl text-gray-600">Start your video call below!</p>
      </div>
      <VideoChat roomId="main-room" />
    </div>
  );
};

export default Index;

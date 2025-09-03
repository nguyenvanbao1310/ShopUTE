// src/pages/Home.tsx
import { FC } from "react";
import Layout from "../layouts/MainLayout";
const Home: FC = () => {
  return (
    <Layout>
      <div className="min-h-[calc(100vh-120px)] flex items-center justify-center bg-green-50">
        <h1 className="text-4xl font-bold text-gray-800">
          Welcome to LAPTOP-UTESHOP!
        </h1>
      </div>
    </Layout>
  );
};

export default Home;

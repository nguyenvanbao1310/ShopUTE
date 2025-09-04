// src/pages/Home.tsx
import { FC } from "react";
import Layout from "../layouts/MainLayout";
import Account from "../components/user/userProfile";
const Home: FC = () => {
  return (
    <Layout>
      <Account />
    </Layout>
  );
};

export default Home;

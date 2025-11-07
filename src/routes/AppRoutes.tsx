import { Route, Routes } from 'react-router-dom';

import { Layout } from '../components/Layout.tsx';
import { LeadDetailPage } from '../pages/LeadDetailPage.tsx';
import { LeadSearchPage } from '../pages/LeadSearchPage.tsx';

export const AppRoutes = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route index element={<LeadSearchPage />} />
      <Route path="leads/:id" element={<LeadDetailPage />} />
    </Route>
  </Routes>
);

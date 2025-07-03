import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Products from '../pages/Cliente/Products';
import Cart from '../pages/Cliente/Cart';
import ProdutorList from '../pages/Produtor/ProductList';
import ProductForm from '../pages/Produtor/ProductForm';
import Home from '../pages/Home';
import {RequireAuth } from './RequireAuth';
import Layout from '../components/Layout';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<RequireAuth role="Cliente" />}>
          <Route path="/cliente/produtos" element={<Products />} />
          <Route path="/cliente/carrinho" element={<Cart />} />
        </Route>

        <Route element={<RequireAuth role="Produtor" />}>
          <Route path="/produtor/flores" element={<ProdutorList />} />
          <Route path="/produtor/flores/novo" element={<ProductForm />} />
          <Route path="/produtor/flores/editar/:id" element={<ProductForm />} />
        </Route>
      </Route>
    </Routes>
  );
}

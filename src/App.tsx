import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { RedirectAuthProvider } from "./context/RedirectAuthContext";
import Index from "./pages/Index";
import ForYou from "./pages/ForYou";
import SearchPage from "./pages/SearchPage";
import ProductDetail from "./pages/ProductDetail";
import SingleProductDetail from "./pages/SingleProductDetail";
import ProductDescriptionPage from "./pages/ProductDescriptionPage";
import ProductCheckout from "./pages/ProductCheckout";
import Posts from "./pages/Posts";
import Videos from "./pages/Videos";
import Reels from "./pages/Reels";
import Trending from "./pages/Trending";
import Messages from "./pages/Messages";
import ProfilePage from "./pages/ProfilePage";
import MoreMenu from "./pages/MoreMenu";
import SimpleAuthPage from "./pages/SimpleAuthPage";
import CategoriesPage from "./pages/CategoriesPage";
import FashionPage from "./pages/FashionPage";
import ElectronicsPage from "./pages/ElectronicsPage";
import HomeLivingPage from "./pages/HomeLivingPage";
import SportsOutdoorsPage from "./pages/SportsOutdoorsPage";
import AutomotivePage from "./pages/AutomotivePage";
import KidsHobbiesPage from "./pages/KidsHobbiesPage";
import EntertainmentPage from "./pages/EntertainmentPage";
import AdminPanel from "./pages/AdminPanel";
import SellerPage from "./pages/SellerPage";
import Checkout from "./pages/Checkout";
import PayPalCheckout from "./pages/PayPalCheckout";
import PayPalHostedCheckout from "./pages/PayPalHostedCheckout";
import PayPalPayment from "./pages/PayPalPayment";
import DynamicPayPalCheckout from "./pages/DynamicPayPalCheckout";
import PayPalDepositPage from "./pages/PayPalDepositPage";
import DepositPage from "./pages/DepositPage";
import NFTPaymentPage from "./pages/NFTPaymentPage";
import TopUpPage from "./pages/TopUpPage";
import NetflixPage from "./pages/NetflixPage";
import TransferPage from "./pages/TransferPage";
import TransferHomePage from "./pages/TransferHomePage";
import MultiStepTransferPage from "./pages/MultiStepTransferPage";
import MultiStepTransferSheetPage from "./pages/MultiStepTransferSheetPage";
import ProductCommentsPage from "./pages/ProductCommentsPage";
import AskQuestionPage from "./pages/AskQuestionPage";
import ProductEditPage from "./pages/ProductEditPage";

import NotFound from "./pages/NotFound";
import MainLayout from "./components/layout/MainLayout";
import { AuthOverlayProvider } from "./context/AuthOverlayContext";
import { ScreenOverlayProvider } from "./context/ScreenOverlayContext";

import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <TooltipProvider>
          <Router>
          <RedirectAuthProvider>
            <AuthOverlayProvider>
              <ScreenOverlayProvider>
                <div className="App min-h-screen bg-background text-foreground">
                  <Routes>
                    <Route path="/" element={<MainLayout />}>
                      <Route index element={<ForYou />} />
                      <Route path="for-you" element={<ForYou />} />
                      <Route path="index" element={<Index />} />
                      <Route path="search" element={<SearchPage />} />
                        <Route path="product/:id" element={<ProductDetail />} />
                        <Route path="product/:id/description" element={<ProductDescriptionPage />} />
                        <Route path="product/:id/comments" element={<ProductCommentsPage />} />
                        <Route path="product/:id/ask-question" element={<AskQuestionPage />} />
                        <Route path="single-product/:id" element={<SingleProductDetail />} />
                        <Route path="single-product/:id/comments" element={<ProductCommentsPage />} />
                        <Route path="single-product/:id/ask-question" element={<AskQuestionPage />} />
                      <Route path="posts" element={<Posts />} />
                      <Route path="videos" element={<Videos />} />
                      <Route path="reels" element={<Reels />} />
                      <Route path="trending" element={<Trending />} />
                      <Route path="messages" element={<Messages />} />
                      <Route path="profile" element={<ProfilePage />} />
                      <Route path="more" element={<MoreMenu />} />
                      <Route path="more-menu" element={<MoreMenu />} />
                      <Route path="auth" element={<SimpleAuthPage />} />
                      <Route path="categories" element={<CategoriesPage />} />
                      <Route path="categories/fashion" element={<FashionPage />} />
                      <Route path="categories/electronics" element={<ElectronicsPage />} />
                      <Route path="categories/home-living" element={<HomeLivingPage />} />
                      <Route path="categories/sports-outdoors" element={<SportsOutdoorsPage />} />
                      <Route path="categories/automotive" element={<AutomotivePage />} />
                      <Route path="categories/kids-hobbies" element={<KidsHobbiesPage />} />
                      <Route path="categories/entertainment" element={<EntertainmentPage />} />
                      <Route path="admin" element={<AdminPanel />} />
                      <Route path="seller/:sellerId" element={<SellerPage />} />
                      <Route path="product/:productId/edit" element={<ProductEditPage />} />
                      <Route path="checkout" element={<Checkout />} />
                      <Route path="product-checkout" element={<ProductCheckout />} />
                      <Route path="paypal-checkout" element={<PayPalCheckout />} />
                      <Route path="paypal-hosted-checkout" element={<PayPalHostedCheckout />} />
                      <Route path="paypal-payment" element={<PayPalPayment />} />
                      <Route path="dynamic-paypal-checkout" element={<DynamicPayPalCheckout />} />
                      <Route path="paypal-deposit" element={<PayPalDepositPage />} />
                      <Route path="deposit" element={<DepositPage />} />
                      <Route path="nft-payment" element={<NFTPaymentPage />} />
                      <Route path="topup" element={<TopUpPage />} />
                      <Route path="netflix" element={<NetflixPage />} />
                      <Route path="transfer-old" element={<TransferPage />} />
                      <Route path="transfer" element={<TransferHomePage />} />
                      <Route path="multi-step-transfer" element={<MultiStepTransferPage />} />
                      <Route path="multi-step-transfer-page" element={<MultiStepTransferSheetPage />} />
                      <Route path="signup" element={<SimpleAuthPage />} />
                      <Route path="auth/callback" element={<ForYou />} />
                      <Route path="*" element={<NotFound />} />
                    </Route>
                  </Routes>
                  <Toaster />
                  <Sonner />
                </div>
              </ScreenOverlayProvider>
            </AuthOverlayProvider>
          </RedirectAuthProvider>
          </Router>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
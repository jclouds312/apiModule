'use client';

import { useState, useEffect } from 'react';
import { apiModules, type ApiModule } from '@/lib/apis';
import ApiCard from '@/components/api-card';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from './app-sidebar';
import Header from './header';
import { useUser } from '@/firebase';
import AuthForm from './auth-form';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { getProducts } from '@/lib/actions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import VoiceQuoteTool from './voice-quote-tool';
import AiPlayground from './ai-playground';
import GoogleMapsTool from './google-maps-tool';
import IntegrationsManager from './integrations-manager';
import { motion } from 'framer-motion';

type ApiModuleWithState = ApiModule & { active: boolean };

function ProductList() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProducts() {
            setLoading(true);
            try {
                const productList = await getProducts();
                if (Array.isArray(productList)) {
                    setProducts(productList);
                } else {
                    console.error("getProducts did not return an array:", productList);
                    setProducts([]);
                }
            } catch (e) {
                console.error("Failed to fetch products:", e);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold tracking-tight text-foreground font-headline mb-4">
                Products
            </h2>
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                                <TableHead className="text-right">Stock</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-24">Loading products...</TableCell>
                                </TableRow>
                            ) : products.length > 0 ? (
                                products.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell className="font-medium">{product.name}</TableCell>
                                        <TableCell><Badge variant="outline">{product.category}</Badge></TableCell>
                                        <TableCell className="text-right">${product.price?.toLocaleString()}</TableCell>
                                        <TableCell className="text-right">{product.stock}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-24">No products found. Add some to your 'products' collection in Firestore.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}


function ApiModulesGrid() {
  const [modules, setModules] = useState<ApiModuleWithState[]>(
    apiModules.map((m) => ({ ...m, active: m.defaultActive }))
  );

  const toggleApiModule = (id: string) => {
    setModules((currentModules) =>
      currentModules.map((mod) =>
        mod.id === id ? { ...mod, active: !mod.active } : mod
      )
    );
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-headline">
          API Modules
        </h1>
        <p className="text-muted-foreground">
          Activate, deactivate, and manage your APIs.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((mod, index) => (
          <motion.div
            key={mod.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
          >
            <ApiCard
              module={mod}
              onToggle={() => toggleApiModule(mod.id)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}


export default function DashboardPage() {
  const { user, loading } = useUser();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <motion.main 
          className="p-4 md:p-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className={user ? "lg:col-span-3" : "lg:col-span-2"}>
              <ApiModulesGrid />
              {user && <IntegrationsManager />}
              {user && <VoiceQuoteTool />}
              {user && <AiPlayground />}
              {user && <GoogleMapsTool />}
              <ProductList />
            </div>
            {!user && !loading && (
               <div className="lg:col-span-1">
                 <Card>
                   <CardHeader>
                     <CardTitle className="text-xl font-headline">Get Started</CardTitle>
                   </CardHeader>
                   <CardContent>
                     <AuthForm type="login" />
                   </CardContent>
                 </Card>
               </div>
            )}
          </div>
        </motion.main>
      </SidebarInset>
    </SidebarProvider>
  );
}

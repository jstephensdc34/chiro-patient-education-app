
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface SignedUrlCache {
  [key: string]: {
    url: string;
    expiresAt: number;
  };
}

export const useSignedUrls = (bucketName: string) => {
  const [urlCache, setUrlCache] = useState<SignedUrlCache>({});
  const [loadingUrls, setLoadingUrls] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();

  const generateSignedUrl = useCallback(async (filePath: string, expiresIn: number = 3600) => {
    const cacheKey = `${bucketName}:${filePath}`;
    
    // Check if we have a valid cached URL
    const cached = urlCache[cacheKey];
    if (cached && Date.now() < cached.expiresAt) {
      return cached.url;
    }

    // Check if we're already loading this URL
    if (loadingUrls[cacheKey]) {
      return null;
    }

    setLoadingUrls(prev => ({ ...prev, [cacheKey]: true }));

    try {
      const { data, error } = await supabase.storage
        .from(bucketName)
        .createSignedUrl(filePath, expiresIn);

      if (error) throw error;

      const url = data.signedUrl;
      const expiresAt = Date.now() + (expiresIn * 1000) - 60000; // Subtract 1 minute for safety

      setUrlCache(prev => ({
        ...prev,
        [cacheKey]: { url, expiresAt }
      }));

      setLoadingUrls(prev => ({ ...prev, [cacheKey]: false }));
      return url;
    } catch (error) {
      console.error('Error generating signed URL:', error);
      setLoadingUrls(prev => ({ ...prev, [cacheKey]: false }));
      toast({
        title: "Error",
        description: "Failed to generate secure URL for file access.",
        variant: "destructive",
      });
      return null;
    }
  }, [bucketName, urlCache, loadingUrls, toast]);

  const isLoadingUrl = useCallback((filePath: string) => {
    const cacheKey = `${bucketName}:${filePath}`;
    return loadingUrls[cacheKey] || false;
  }, [bucketName, loadingUrls]);

  const getUrlFromCache = useCallback((filePath: string) => {
    const cacheKey = `${bucketName}:${filePath}`;
    const cached = urlCache[cacheKey];
    return cached && Date.now() < cached.expiresAt ? cached.url : null;
  }, [bucketName, urlCache]);

  return {
    generateSignedUrl,
    isLoadingUrl,
    getUrlFromCache
  };
};

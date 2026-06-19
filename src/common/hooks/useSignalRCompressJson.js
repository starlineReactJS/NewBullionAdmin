import { useCallback } from "react";
import pako from "pako";

export const useSignalRCompressJson = () => {
    const decode = useCallback((data) => {
        try {
            if (!data) return null;

            // const compressed = Uint8Array.from(
            //     atob(data),
            //     (c) => c.charCodeAt(0)
            // );

            // const decompressed = pako.ungzip(compressed, { to: "string" });

            // return JSON.parse(decompressed);
            const byteArray = new Uint8Array(data);
            const decompressedBytes = pako.ungzip(byteArray);
            const decoder = new TextDecoder("utf-8");
            const jsonString = decoder.decode(decompressedBytes);

            return JSON.parse(jsonString);
        } catch (error) {
            console.error("SignalR compressed JSON decode error:", error);
            return null;
        }
    }, []);

    return { decode };
};

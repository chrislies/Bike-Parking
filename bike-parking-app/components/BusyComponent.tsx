import React, { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from "@/utils/supabase/browser-client";

interface BusyComponentProps {
    x: number;
    y: number;
}

const BusyComponent = ({ x, y }: BusyComponentProps) => {
    const [isBusy, setIsBusy] = useState(false);
    const supabase = createSupabaseBrowserClient();

    const getFavoritesCount = async () => {
        const { data, error, count } = await supabase
            .from('Favorites')
            .select('*', { count: 'exact' })
            .eq('x_coord', x)
            .eq('y_coord', y);

        if (error) {
            console.error('Error fetching favorite count:', error);
            return;
        }

        const favoriteCount = count ?? 0;
        setIsBusy(favoriteCount >= 10);
    };

    useEffect(() => {
        getFavoritesCount();
    }, [x, y]);

    return (
        <div>
            {isBusy ? (
                // Need to add icon here
                <span className="busy-icon">Busy</span>
            ) : (
                <span className="not-busy-icon">Not Busy</span>
            )}
        </div>
    );
};

export default BusyComponent;
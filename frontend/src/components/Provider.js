'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState } from 'react';
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental';

const Provider = ({ children }) => {
	const [client] = useState(new QueryClient());

	return (
		<QueryClientProvider client={client}>
			<ReactQueryStreamedHydration>{children}</ReactQueryStreamedHydration>
		</QueryClientProvider>
	);
};

export default Provider;

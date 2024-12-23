/**
 * Generated by orval 🍺
 * Do not edit manually.
 * Swagger of Moudro Dne
 * Implementation of Swagger documentation of Moudro Dne
 * OpenAPI spec version: v0.0.1
 */
import { useQuery } from '@tanstack/react-query';
import type { DataTag, DefinedInitialDataOptions, DefinedUseQueryResult, QueryFunction, QueryKey, UndefinedInitialDataOptions, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { axiosInstance } from '../../../utils/axiosInstance';

export const getHello = (signal?: AbortSignal) => {
  return axiosInstance<void>({ url: `/hello`, method: 'GET', signal });
};

export const getGetHelloQueryKey = () => {
  return [`/hello`] as const;
};

export const getGetHelloQueryOptions = <TData = Awaited<ReturnType<typeof getHello>>, TError = unknown>(options?: {
  query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getHello>>, TError, TData>>;
}) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetHelloQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getHello>>> = ({ signal }) => getHello(signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<Awaited<ReturnType<typeof getHello>>, TError, TData> & { queryKey: DataTag<QueryKey, TData> };
};

export type GetHelloQueryResult = NonNullable<Awaited<ReturnType<typeof getHello>>>;
export type GetHelloQueryError = unknown;

export function useGetHello<TData = Awaited<ReturnType<typeof getHello>>, TError = unknown>(options: {
  query: Partial<UseQueryOptions<Awaited<ReturnType<typeof getHello>>, TError, TData>> & Pick<DefinedInitialDataOptions<Awaited<ReturnType<typeof getHello>>, TError, TData>, 'initialData'>;
}): DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };
export function useGetHello<TData = Awaited<ReturnType<typeof getHello>>, TError = unknown>(options?: {
  query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getHello>>, TError, TData>> & Pick<UndefinedInitialDataOptions<Awaited<ReturnType<typeof getHello>>, TError, TData>, 'initialData'>;
}): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };
export function useGetHello<TData = Awaited<ReturnType<typeof getHello>>, TError = unknown>(options?: {
  query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getHello>>, TError, TData>>;
}): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };

export function useGetHello<TData = Awaited<ReturnType<typeof getHello>>, TError = unknown>(options?: {
  query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getHello>>, TError, TData>>;
}): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> } {
  const queryOptions = getGetHelloQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };

  query.queryKey = queryOptions.queryKey;

  return query;
}

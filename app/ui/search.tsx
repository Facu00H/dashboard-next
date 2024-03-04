'use client'

import { useState, useEffect, useDeferredValue } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export default function Search({ placeholder }: { placeholder: string }) {
  const [inputValue, setInputValue] = useState('');
  const deferredInputValue = useDeferredValue(inputValue);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Efecto para manejar cambios en el valor de entrada diferido
  useEffect(() => {
    const handleSearch = () => {
      const params = new URLSearchParams(searchParams);
      params.set('page', '1');
      if (deferredInputValue) {
        params.set('query', deferredInputValue);
      } else {
        params.delete('query');
      }
      replace(`${pathname}?${params.toString()}`);
    };

    // Debounce manual sin usar useDebounce para simplificar la integración con useDeferredValue
    const timerId = setTimeout(handleSearch, 300); // Ajusta el tiempo de debounce según sea necesario

    return () => clearTimeout(timerId); // Limpieza para evitar efectos no deseados en actualizaciones rápidas
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deferredInputValue]);

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => setInputValue(e.target.value)}
        defaultValue={searchParams.get('query')?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}

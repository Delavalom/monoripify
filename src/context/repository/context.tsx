/* eslint-disable @typescript-eslint/no-empty-function */
import { type Dispatch, type ReactNode, type SetStateAction, createContext, useState } from "react";

type MyRepoType = {
  repository: Partial<CustomRepoSchema> | null
  setRepository: Dispatch<SetStateAction<Partial<CustomRepoSchema> | null>>
}

const initialContext = {
  repository: null,
  setRepository: () => {},
};

export const MyRepoContext = createContext<MyRepoType>(initialContext);

export const RepositoryProvider = ({children}: {children: ReactNode}) => {
  const [repository, setRepository] = useState<Partial<CustomRepoSchema> | null>(null)

  return (
    <MyRepoContext.Provider value={{repository, setRepository}}>
      {children}
    </MyRepoContext.Provider>
  )
}
    

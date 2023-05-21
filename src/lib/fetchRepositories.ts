export async function fetchRepositories() {
  const response = await fetch("/api/repositories");

  const json = (await response.json()) as {
    message: string;
    data: Partial<CustomRepoSchema>[];
  };

  return json;
}

import { Project } from '../data/mockData';

export interface ProjectSortStrategy {
  sort(projects: Project[]): Project[];
}

export class SortByDateStrategy implements ProjectSortStrategy {
  sort(projects: Project[]): Project[] {
    return [...projects].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
}

export class SortByTitleStrategy implements ProjectSortStrategy {
  sort(projects: Project[]): Project[] {
    return [...projects].sort((a, b) => a.title.localeCompare(b.title));
  }
}

export class SortByCategoryStrategy implements ProjectSortStrategy {
  sort(projects: Project[]): Project[] {
    return [...projects].sort((a, b) => a.category.localeCompare(b.category));
  }
}

export class ProjectSorter {
  constructor(private strategy: ProjectSortStrategy) {}

  setStrategy(strategy: ProjectSortStrategy) {
    this.strategy = strategy;
  }

  sort(projects: Project[]): Project[] {
    return this.strategy.sort(projects);
  }
}
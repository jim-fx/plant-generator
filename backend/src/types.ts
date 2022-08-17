import type { Project as InternalProject } from "./projects/entities/project.entity";
import type { Report as InternalReport } from "./report/report.entity";
import { User as InternalUser } from "./user/user.entity";

type ReplaceId<T> = Omit<T, "_id"> & { id: string };
export type PaginatedResult<T> = {
  amount: number,
  offset: number,
  result: T
}

type User = ReplaceId<InternalUser>;
type Project = Omit<ReplaceId<InternalProject>, "likes" | "addLike" | "removeLike" | "toJSON"> & { likes: string[] };
type Report = ReplaceId<InternalReport>;

export type { CreateReportDto } from "./report/dto/create-report.dto";
export { User, Project, Report };


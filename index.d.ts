import { Octokit } from '@octokit/rest';

export interface DriverOptions {
  username: string;
  repository: string;
  token: string;
  path?: string;
  message?: string;
  [key: string]: any;
}

export function makeId(length?: number): string;
export function formatSize(bytes: number): string;
export function isJson(data: string): boolean;
export function createDriver(options: DriverOptions): any;
export function fetchFile(driver: any): Promise<any>;
export function saveFile(driver: any, data: any, extraOptions?: any): Promise<any>;

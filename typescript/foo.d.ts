interface IFoo {
  get: (url: string) => string;
  post: (url: string, data: any) => string;
}
declare const foo: IFoo;

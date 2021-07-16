export default (unknown: any): string =>
    Object.prototype.toString.call(unknown).split('').slice(8, -1).join('').toLowerCase();

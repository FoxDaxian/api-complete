export default function getCamelCase(str: string, sep: string = '/'): string {
    return str
        .split(sep)
        .filter((_) => _)
        .map((_: string) =>
            _.includes('_')
                ? getCamelCase(_, '_')
                : _[0].toUpperCase() + _.substr(1)
        )
        .join('');
}

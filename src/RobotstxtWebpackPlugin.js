import path from 'path';
import robotstxt from 'generate-robotstxt';

export default class RobotstxtWebpackPlugin {
    constructor(options = {}) {
        this.options = Object.assign({}, options);
    }

    apply(compiler) {
        compiler.plugin('emit', (compilation, callback) => this.generate(compilation, callback));
    }

    generate(compilation, callback) {
        const options = this.options;

        return robotstxt(options)
            .then((contents) => {
                const dest = options.dest ? path.join(options.dest, 'robots.txt') : 'robots.txt';

                compilation.assets[dest] = {
                    size() {
                        return Buffer.byteLength(this.source(), 'utf8');
                    },
                    source() {
                        return contents;
                    }
                };

                return contents;
            })
            .then(() => callback())
            .catch((error) => {
                compilation.errors.push(error);

                return callback();
            });
    }
}
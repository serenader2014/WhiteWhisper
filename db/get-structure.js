import resourceStructure from '../constant/resource-structure';

const expressionReg = /^(.+)(<|=|>)(.+)$/;
const userPropertyReg = /^user\.(\w+)/;
const resourcePropertyReg = /^resource\.(\w+)/;
const stringReg = /^('|")(\w+)('|")$/;

export default function (bookshelf) {
    class Model extends bookshelf.Model {
        structure(currentUser) {
            const tableName = this.tableName;
            const structure = resourceStructure[tableName];
            const result = {};

            if (!structure) {
                return {};
            }
            Object.keys(structure).forEach((key) => {
                const option = structure[key];
                const accessControl = option.access;
                let allowed = false;

                for (const i of accessControl) {
                    if (i === 'public') {
                        allowed = true;
                        break;
                    }

                    const expressionMatchResult = i.match(expressionReg);
                    if (!expressionMatchResult) {
                        continue;
                    }

                    const left = expressionMatchResult[1];
                    const condition = expressionMatchResult[2];
                    const right = expressionMatchResult[3];
                    let leftExpression;
                    let rightExpression;

                    const leftUserMatchResult = left.match(userPropertyReg);
                    const leftResourceMatchResult = left.match(resourcePropertyReg);
                    const rightUserMatchResult = right.match(userPropertyReg);
                    const rightResourceMatchResult = right.match(resourcePropertyReg);
                    const rightStringMatchResult = right.match(stringReg);

                    if (leftUserMatchResult) {
                        leftExpression = currentUser ? currentUser[leftUserMatchResult[1]] : null;
                    }

                    if (leftResourceMatchResult) {
                        leftExpression = this[leftResourceMatchResult[1]];
                    }

                    if (rightUserMatchResult) {
                        rightExpression = currentUser ? currentUser[rightUserMatchResult[1]] : null;
                    }

                    if (rightResourceMatchResult) {
                        rightExpression = this[rightResourceMatchResult[1]];
                    }

                    if (rightStringMatchResult) {
                        rightExpression = rightStringMatchResult[2];
                    }

                    switch (condition) {
                        case '<': {
                            allowed = leftExpression < rightExpression;
                            break;
                        }
                        case '>': {
                            allowed = leftExpression > rightExpression;
                            break;
                        }
                        case '=':
                        default: {
                            /* eslint-disable eqeqeq */
                            allowed = leftExpression == rightExpression;
                            break;
                        }
                    }

                    if (allowed) {
                        break;
                    }
                }

                result[key] = allowed ? this.attributes[key] : null;
            });
            return result;
        }
    }

    /* eslint-disable no-param-reassign */
    bookshelf.Model = Model;
}

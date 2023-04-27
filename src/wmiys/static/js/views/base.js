


export class BaseView
{
    _initProperties(apiStructure) {
        const thisObjectKeys = Object.keys(this);

        for (const key in apiStructure) {
            if (thisObjectKeys.includes(key)) {
                this[key] = apiStructure[key];
            }
        }
    }
}


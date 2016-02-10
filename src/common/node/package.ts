// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for details.

import {Node} from "./node";
import * as pathModule from "path";

interface IPackageDependencyDict {
    [packageName: string]: string;
}

export interface IPackageInformation {
    name: string;
    version: string;
    dependencies?: IPackageDependencyDict;
    main?: string;
}

export class Package {
    private _path: string;
    private INFORMATION_PACKAGE_FILENAME = "package.json";

    constructor(path: string) {
        this._path = path;
    }

    public parsePackageInformation(): Q.Promise<IPackageInformation> {
        return new Node.FileSystem().readFile(this.informationJsonFilePath(), "utf8")
            .then(data =>
                <IPackageInformation>JSON.parse(data));
    }

    public name(): Q.Promise<string> {
        return this.parsePackageInformation()
            .then(packageInformation =>
                packageInformation.name);
    }

    public dependencies(): Q.Promise<IPackageDependencyDict> {
        return this.parsePackageInformation()
            .then(packageInformation => packageInformation.dependencies);
    }

    public setMainFile(value: string): Q.Promise<void> {
        return this.parsePackageInformation()
        .then(packageInformation => {
            packageInformation.main = value;
            return new Node.FileSystem().writeFile(this.informationJsonFilePath(), JSON.stringify(<Object>packageInformation));
        });
    }

    private informationJsonFilePath(): string {
        return pathModule.resolve(this._path, this.INFORMATION_PACKAGE_FILENAME);
    }
}
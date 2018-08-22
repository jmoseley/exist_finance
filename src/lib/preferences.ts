import * as _ from 'lodash';

class Preferences {
  public getPreference(preferenceName: Preferences.Names): any {
    const preferenceValue = localStorage.getItem(this.getKeyName(preferenceName));
    if (!preferenceValue) {
      return Preferences.DefaultPreferences[preferenceName];
    }

    return JSON.parse(preferenceValue);
  }

  public setPreference(preferenceName: Preferences.Names, value: any): void {
    localStorage.setItem(this.getKeyName(preferenceName), JSON.stringify(value));
  }

  private getKeyName(preferenceName: Preferences.Names): string {
    return `preferences:${preferenceName}`;
  }
}

namespace Preferences {
  export enum Names {
    TAG_PAYCHECK = 'TAG_PAYCHECK',
  }

  export const DefaultPreferences = {
    [Preferences.Names.TAG_PAYCHECK]: false,
  };
}

export { Preferences };

export default new Preferences();

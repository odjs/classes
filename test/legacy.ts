interface LegacyClassObjectInstance {
  class1: boolean;
  class2: boolean;
}

interface LegacyClassObjectConstructor {
  readonly prototype: {
    class2: boolean;
  };
  new(): LegacyClassObjectInstance;
}

function LegacyClassObject(this: LegacyClassObjectInstance) {
  this.class1 = true;
}

LegacyClassObject.prototype.class2 = true;

export default LegacyClassObject as unknown as LegacyClassObjectConstructor;

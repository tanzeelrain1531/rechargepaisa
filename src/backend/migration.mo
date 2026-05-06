// migration.mo: No-op migration for RechargePaisa.
// The current backend uses enhanced orthogonal persistence with no stable variables,
// so OldActor is empty — there is nothing to migrate from the previous schema.
module {
  type OldActor = {};
  type NewActor = {};

  public func run(_old : OldActor) : NewActor { {} };
};

# Labelled connection-resolution suite

The 46-reference labelled suite behind report Table 8 and Figure 6, built on
18 October 2026. It tests the implemented resolver and the prototype
refinement on references that neither was designed against: it was written
after the prototype was designed, and frozen before either was run on it.

## Protocol

1. `suite.json` was written and labelled from the demonstration workbooks
   before any resolver was run on it. Each reference has a declaring
   entity, the raw text, the entity a careful human reader would link it to
   (or `null`), and one of 12 categories.
2. The file was then frozen. Its SHA-256 at that point was
   `0e6d474c0cd3e64a486f9a64f76db53b98c7d87430a28ab5fb663fadc534ba51`.
   `score.ts` refuses to run if the file has changed.
3. Only then were the resolvers run (`npm run resolution`). Results are
   reported as they came out.

## Limitations

- The suite was written by someone who had already read the resolver's
  source code. It is therefore
  held out from the prototype's *design*, but its author was not blind to
  how the resolver works.
- References are drawn from the demonstration workbooks, not from partners'
  real connection cells, and the category mix (46 references: 34 with a true
  target, 12 without) was chosen to cover each reference pattern, not to
  match the frequencies found in real data. Precision and recall therefore
  describe behaviour per pattern, not expected performance on a real file.
- `resolvers.ts` implements the prototype refinement from its description
  in report Section 5.2.

## Resolvers compared

| Name | Description |
|---|---|
| `exact-id` | The original design: a reference links only if it equals an existing generated ID |
| `implemented` | The application's resolver, `frontend/src/utils/resolveConnections.ts`, imported unchanged |
| `prototype` | The refinement in report Section 5.2, implemented in `resolvers.ts`: containment is tested on whole-word boundaries, and a reference contained in a longer name is accepted only if it is an upper-case acronym of four or more letters |

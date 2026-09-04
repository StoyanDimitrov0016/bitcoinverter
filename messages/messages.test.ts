import { parse, TYPE, type MessageFormatElement } from "@formatjs/icu-messageformat-parser";
import { describe, expect, it } from "vitest";

import bg from "./bg.json";
import en from "./en.json";

type MessageTree = { [key: string]: string | MessageTree };

function flatten(tree: MessageTree, prefix = ""): [string, string][] {
  return Object.entries(tree).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof value === "string" ? [[path, value] as const] : flatten(value, path);
  });
}

type References = { args: Set<string>; tags: Set<string> };

function collectReferences(nodes: MessageFormatElement[], refs: References) {
  for (const node of nodes) {
    switch (node.type) {
      case TYPE.argument:
      case TYPE.number:
      case TYPE.date:
      case TYPE.time:
        refs.args.add(node.value);
        break;
      case TYPE.select:
      case TYPE.plural:
        refs.args.add(node.value);
        for (const option of Object.values(node.options)) {
          collectReferences(option.value, refs);
        }
        break;
      case TYPE.tag:
        refs.tags.add(node.value);
        collectReferences(node.children, refs);
        break;
      case TYPE.literal:
      case TYPE.pound:
        break;
    }
  }
}

function extractReferences(message: string): References {
  const refs: References = { args: new Set(), tags: new Set() };
  collectReferences(parse(message), refs);
  return refs;
}

const enEntries = flatten(en);
const bgByKey = new Map(flatten(bg));

describe("messages/en.json and messages/bg.json stay in sync", () => {
  it("declare the same set of keys", () => {
    const enKeys = enEntries.map(([key]) => key).toSorted();
    const bgKeys = [...bgByKey.keys()].toSorted();
    expect(bgKeys).toEqual(enKeys);
  });

  it.each(enEntries)(
    "`%s` has matching ICU placeholders and tags in both locales",
    (key, enValue) => {
      const bgValue = bgByKey.get(key);
      if (bgValue === undefined) {
        return;
      }

      const enRefs = extractReferences(enValue);
      const bgRefs = extractReferences(bgValue);

      expect([...bgRefs.args].toSorted()).toEqual([...enRefs.args].toSorted());
      expect([...bgRefs.tags].toSorted()).toEqual([...enRefs.tags].toSorted());
    }
  );
});

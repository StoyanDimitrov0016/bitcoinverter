function findPropsType(program, expectedName, componentStart) {
  return program.body.some(
    (statement) =>
      (statement.type === "TSTypeAliasDeclaration" ||
        statement.type === "TSInterfaceDeclaration") &&
      statement.id.name === expectedName &&
      statement.range[0] < componentStart
  );
}

function checkComponent(context, node, name) {
  if (node.params.length === 0) return;

  const props = node.params[0];
  const expectedName = `${name}Props`;

  if (props.type !== "ObjectPattern") {
    context.report({
      node: props,
      message: `Destructure component props and annotate them with ${expectedName}.`,
    });
    return;
  }

  const annotation = props.typeAnnotation?.typeAnnotation;
  const referencedName =
    annotation?.type === "TSTypeReference" && annotation.typeName.type === "Identifier"
      ? annotation.typeName.name
      : undefined;

  if (referencedName !== expectedName) {
    context.report({
      node: props,
      message: `Component props must reference the named type ${expectedName}.`,
    });
    return;
  }

  const program = context.sourceCode.ast;
  if (!findPropsType(program, expectedName, node.range[0])) {
    context.report({
      node: props,
      message: `Declare the ${expectedName} type above the component.`,
    });
  }
}

const requireComponentPropsType = {
  meta: { type: "suggestion", schema: [] },
  create(context) {
    return {
      FunctionDeclaration(node) {
        if (node.id?.name && /^[A-Z]/.test(node.id.name)) {
          checkComponent(context, node, node.id.name);
        }
      },
      VariableDeclarator(node) {
        if (
          node.id.type === "Identifier" &&
          /^[A-Z]/.test(node.id.name) &&
          (node.init?.type === "ArrowFunctionExpression" ||
            node.init?.type === "FunctionExpression")
        ) {
          checkComponent(context, node.init, node.id.name);
        }
      },
    };
  },
};

export default {
  meta: { name: "bitcoinverter" },
  rules: { "require-component-props-type": requireComponentPropsType },
};

import {
  ClassDeclaration,
  isTypeParameterInstantiation,
  isTypeParameterDeclaration,
  ClassImplements,
  ClassExpression,
  ClassBody,
} from '@babel/types';
import { NodePath } from '@babel/traverse';

import { convertInterfaceExtends } from '../converters/convert_interface_declaration';
import { convertTypeParameterInstantiation } from '../converters/convert_type_parameter_instantiation';
import { convertTypeParameterDeclaration } from '../converters/convert_type_parameter_declaration';
import { replaceWith } from '../utils/replaceWith';
import { transformClassBody } from '../transforms/transform_class_body';
import { narrowNodePathsToOne } from '../utils/narrowNodePathsToOne';

export function ClassDeclaration(path: NodePath<ClassDeclaration | ClassExpression>) {
  const node = path.node;

  const superTypeParameters = node.superTypeParameters;
  if (isTypeParameterInstantiation(superTypeParameters)) {
    replaceWith(
      narrowNodePathsToOne(path.get('superTypeParameters')),
      convertTypeParameterInstantiation(superTypeParameters),
    );
  }

  const typeParameters = node.typeParameters;
  if (isTypeParameterDeclaration(typeParameters)) {
    replaceWith(
      narrowNodePathsToOne(path.get('typeParameters')),
      convertTypeParameterDeclaration(typeParameters),
    );
  }

  const classImplements = node.implements;
  if (Array.isArray(classImplements)) {
    const classImplements = path.get('implements') as NodePath<ClassImplements>[];
    if (classImplements !== null) {
      for (const classImplement of classImplements) {
        if (classImplement.isClassImplements()) {
          replaceWith(classImplement, convertInterfaceExtends(classImplement.node));
        }
      }
    }
  }

  transformClassBody(narrowNodePathsToOne(path.get('body')) as NodePath<ClassBody>);
}

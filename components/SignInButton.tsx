"use client";

import React from 'react'
import { Button, ButtonProps } from './ui/button';
import { signIn } from 'next-auth/react';

type Props = {
  text: string,
  styles?: string,
  variant: string
}

const SignInButton = ({text, styles, variant}: Props) => {
  return (
    <Button className={styles} variant={variant} onClick={() => {
      signIn("google").catch(console.error)
    }}>
      {text}
    </Button>
  )
}

export default SignInButton
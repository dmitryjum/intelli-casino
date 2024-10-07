"use client";

import React from 'react'
import { Button, ButtonProps } from './ui/button';
import { signIn } from 'next-auth/react';

interface SignInButtonProps extends ButtonProps {
  text: string;
}

const SignInButton: React.FC<SignInButtonProps> = ({text, ...props}) => {
  console.log(props);
  return (
    <Button onClick={() => {
      signIn("google").catch(console.error)
    }} {...props}>
      {text}
    </Button>
  )
}

export default SignInButton
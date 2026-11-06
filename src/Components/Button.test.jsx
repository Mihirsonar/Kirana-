import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Button from './Button'

describe('Button Component', () => {
    it('should render button with text', () => {
        render(<Button>Add to Cart</Button>)
        expect(screen.getByText('Add to Cart')).toBeInTheDocument()
    })
})
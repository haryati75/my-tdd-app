import { render, screen, fireEvent } from '@testing-library/react';
import Input from './Input';

describe('Input Component', () => {
  it('renders an input element', () => {
    render(<Input label="Test Label" min={1} max={10} value={1} onChange={() => {}} />);
    const inputElement = screen.getByRole('spinbutton');
    expect(inputElement).toBeInTheDocument();
  });

  it('displays the label text', () => {
    render(<Input label="Test Label" min={1} max={10} value={1} onChange={() => {}} />);
    const labelElement = screen.getByText('Test Label');
    expect(labelElement).toBeInTheDocument();
  });

  it('calls onChange with the correct value when input changes', () => {
    const handleChange = vi.fn();
    render(<Input label="Test Label" min={1} max={10} value={1} onChange={handleChange} />);
    const inputElement = screen.getByRole('spinbutton');

    fireEvent.change(inputElement, { target: { value: '5' } });
    expect(handleChange).toHaveBeenCalledWith(5);
  });

  it('does not call onChange if the input value is not a number', () => {
    const handleChange = vi.fn();
    render(<Input label="Test Label" min={1} max={10} value={1} onChange={handleChange} />);
    const inputElement = screen.getByRole('spinbutton');

    fireEvent.change(inputElement, { target: { value: 'abc' } });
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('respects the min and max attributes', () => {
    render(<Input label="Test Label" min={1} max={10} value={1} onChange={() => {}} />);
    const inputElement = screen.getByRole('spinbutton');

    expect(inputElement).toHaveAttribute('min', '1');
    expect(inputElement).toHaveAttribute('max', '10');
  });

  it('uses default min and max values when not specified', () => {
    render(<Input label="Test Label" value={0} onChange={() => {}} />);
    const inputElement = screen.getByRole('spinbutton');
    
    expect(inputElement).toHaveAttribute('min', '0');
    expect(inputElement).toHaveAttribute('max', '100');
  });

  it('links label to input with the proper id', () => {
    render(<Input label="Test Label" min={1} max={10} value={1} onChange={() => {}} />);
    const labelElement = screen.getByText('Test Label');
    const inputElement = screen.getByRole('spinbutton');
    
    expect(labelElement).toHaveAttribute('for', 'number-input');
    expect(inputElement).toHaveAttribute('id', 'number-input');
  });

  it('uses custom id when provided', () => {
    render(<Input label="Test Label" min={1} max={10} value={1} onChange={() => {}} id="custom-id" />);
    const labelElement = screen.getByText('Test Label');
    const inputElement = screen.getByRole('spinbutton');
    
    expect(labelElement).toHaveAttribute('for', 'custom-id');
    expect(inputElement).toHaveAttribute('id', 'custom-id');
  });

  it('reflects value prop in the input element', () => {
    render(<Input label="Test Label" min={1} max={10} value={7} onChange={() => {}} />);
    const inputElement = screen.getByRole('spinbutton');
    expect(inputElement).toHaveValue(7);
  });
});
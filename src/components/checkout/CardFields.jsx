import Input from "../ui/Input";
import { formatCardNumber, formatExpiry } from "../../utils/validators";

export default function CardFields({ values, errors, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <p className="caption col-span-2 -mt-1">
        Demo checkout: enter any values. Card details are not stored or sent
        anywhere.
      </p>
      <Input
        className="col-span-2"
        name="cardNumber"
        label="Card number"
        inputMode="numeric"
        autoComplete="cc-number"
        placeholder="1234 5678 9012 3456"
        value={values.cardNumber}
        error={errors.cardNumber}
        onChange={(e) =>
          onChange("cardNumber", formatCardNumber(e.target.value))
        }
      />
      <Input
        className="col-span-2"
        name="cardName"
        label="Name on card"
        autoComplete="cc-name"
        value={values.cardName}
        error={errors.cardName}
        onChange={(e) => onChange("cardName", e.target.value)}
      />
      <Input
        name="cardExpiry"
        label="Expiry"
        inputMode="numeric"
        autoComplete="cc-exp"
        placeholder="MM/YY"
        value={values.cardExpiry}
        error={errors.cardExpiry}
        onChange={(e) => onChange("cardExpiry", formatExpiry(e.target.value))}
      />
      <Input
        name="cardCvc"
        label="CVC"
        inputMode="numeric"
        autoComplete="cc-csc"
        placeholder="123"
        maxLength={4}
        value={values.cardCvc}
        error={errors.cardCvc}
        onChange={(e) => onChange("cardCvc", e.target.value.replace(/\D/g, ""))}
      />
    </div>
  );
}

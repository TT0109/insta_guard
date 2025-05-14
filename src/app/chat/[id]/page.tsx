import ChatPage from "./Client"

export function generateStaticParams() {
  // You would typically fetch this data from your API or database
  // For now, we'll return some sample IDs
  return [
    { id: '0' },
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: '6' },
    { id: '7' },
    { id: '8' },
  ]
}

export default function Page() {
  return <ChatPage />
}

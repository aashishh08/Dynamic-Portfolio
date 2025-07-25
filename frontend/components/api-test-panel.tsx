"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useYahooFinance } from "@/hooks/useYahooFinance"
import { useGoogleFinance } from "@/hooks/useGoogleFinance"
import { Loader2 } from "lucide-react"

export function ApiTestPanel() {
  const [yahooSymbol, setYahooSymbol] = useState("HDFCBANK")
  const [googleSymbol, setGoogleSymbol] = useState("HDFCBANK")
  const [yahooResult, setYahooResult] = useState<any>(null)
  const [googleResult, setGoogleResult] = useState<any>(null)

  const { fetchPrice, loading: yahooLoading } = useYahooFinance()
  const { fetchFinancials, loading: googleLoading } = useGoogleFinance()

  const testYahooApi = async () => {
    const result = await fetchPrice(yahooSymbol)
    setYahooResult(result)
  }

  const testGoogleApi = async () => {
    const result = await fetchFinancials(googleSymbol)
    setGoogleResult(result)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>API Test Panel</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="yahoo" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="yahoo">Yahoo Finance</TabsTrigger>
            <TabsTrigger value="google">Google Finance</TabsTrigger>
          </TabsList>

          <TabsContent value="yahoo" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="yahoo-symbol">Stock Symbol</Label>
              <Input
                id="yahoo-symbol"
                value={yahooSymbol}
                onChange={(e) => setYahooSymbol(e.target.value)}
                placeholder="Enter stock symbol (e.g., HDFCBANK)"
              />
            </div>

            <Button onClick={testYahooApi} disabled={yahooLoading} className="w-full">
              {yahooLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Test Yahoo Finance API
            </Button>

            {yahooResult && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                <h4 className="font-semibold mb-2">Result:</h4>
                <pre className="text-sm">{JSON.stringify(yahooResult, null, 2)}</pre>
              </div>
            )}
          </TabsContent>

          <TabsContent value="google" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="google-symbol">Stock Symbol</Label>
              <Input
                id="google-symbol"
                value={googleSymbol}
                onChange={(e) => setGoogleSymbol(e.target.value)}
                placeholder="Enter stock symbol (e.g., HDFCBANK)"
              />
            </div>

            <Button onClick={testGoogleApi} disabled={googleLoading} className="w-full">
              {googleLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Test Google Finance API
            </Button>

            {googleResult && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                <h4 className="font-semibold mb-2">Result:</h4>
                <pre className="text-sm">{JSON.stringify(googleResult, null, 2)}</pre>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

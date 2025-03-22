"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "../../supabase/client";

export default function UsernameChecker() {
  const [username, setUsername] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  // Reset availability when username changes
  useEffect(() => {
    setIsAvailable(null);
    setError("");
  }, [username]);

  const validateUsername = (value: string) => {
    if (!value) {
      setError("Por favor, digite um nome de usuário");
      return false;
    }

    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(value)) {
      setError(
        "Nome de usuário só pode conter letras, números, underscores e hífens"
      );
      return false;
    }

    return true;
  };

  const checkAvailability = async () => {
    if (!validateUsername(username)) return;

    setIsChecking(true);
    setError("");

    try {
      // Verificar se o username já existe
      const { data, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", username)
        .maybeSingle();

      if (error) throw error;

      // Se não retornou dados, o username está disponível
      setIsAvailable(!data);
    } catch (err) {
      setError("Erro ao verificar disponibilidade. Tente novamente.");
      setIsAvailable(null);
    } finally {
      setIsChecking(false);
    }
  };

  const handleClaim = () => {
    if (!isAvailable) return;

    // Redirecionar para a página de cadastro com o username pré-preenchido
    router.push(`/sign-up?username=${encodeURIComponent(username)}`);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="backdrop-blur-lg bg-white/[0.04] border border-white/10 rounded-xl p-6 shadow-lg shadow-indigo-900/20 hover:shadow-indigo-800/30 transition-all duration-300">
        <div className="text-left mb-4">
          <h3 className="text-xl font-semibold text-white">
            Choose your username
          </h3>
          <p className="text-gray-300 text-sm mt-1">    
            Check the availability of your username
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="username"
              className="text-sm font-medium text-gray-200"
            >
              Username
            </Label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span className="text-gray-500">lynkr.me/</span>
              </div>
              <Input
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="seunome"
                className="w-full pl-24 bg-gray-900/70 border-white/10 focus:border-indigo-500 focus:ring-indigo-500/30 transition-all duration-300 text-gray-200"
              />
              <div className="absolute inset-0 rounded-md border border-indigo-500/0 group-focus-within:border-indigo-500/50 pointer-events-none transition-all duration-300"></div>

              {isChecking && (
                <div className="absolute inset-y-0 right-3 flex items-center">
                  <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
                </div>
              )}

              {isAvailable === true && !isChecking && (
                <div className="absolute inset-y-0 right-3 flex items-center">
                  <Check className="w-5 h-5 text-green-500" />
                </div>
              )}

              {isAvailable === false && !isChecking && (
                <div className="absolute inset-y-0 right-3 flex items-center">
                  <X className="w-5 h-5 text-red-500" />
                </div>
              )}
            </div>

            {error && <p className="text-xs text-red-400 mt-1">{error}</p>}

            {isAvailable === false && !error && (
              <p className="text-xs text-red-400 mt-1">
                This username is already in use
              </p>
            )}

            {isAvailable === true && !error && (
              <p className="text-xs text-green-400 mt-1">
                Username available!
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              onClick={checkAvailability}
              disabled={isChecking || !username}
              variant="outline"
              className="flex-1 bg-white/[0.04] backdrop-blur-lg border-white/10 hover:bg-white/[0.08] hover:text-indigo-400 text-white transition-all duration-300"
            >
              {isChecking ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                "Check availability"
              )}
            </Button>

            <Button
              onClick={handleClaim}
              disabled={!isAvailable || isChecking}
              className="flex-1 relative overflow-hidden bg-indigo-600 hover:bg-indigo-500 text-white transition-all duration-300 shadow-lg shadow-indigo-600/30 group"
            >
              <span className="relative z-10 flex items-center justify-center">
                Register
                <ArrowUpRight className="ml-2 w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-indigo-400 to-purple-400 w-0 group-hover:w-full transition-all duration-500 ease-in-out"></span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
